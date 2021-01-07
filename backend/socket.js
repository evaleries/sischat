const _ = require('lodash');
const MessageModel = require('./models/message');

module.exports = function(server) {
    global.onlineUsers = [];
    const io = require('socket.io')(server);

    io.on('connection', (client) => {
        client.on('DISCONNECT', user => {
          if (user._id == null) {
            _.remove(onlineUsers, ['id', client.id]);
            io.emit('ALL_ONLINE_USERS', onlineUsers);
            return;
          }

          _.remove(onlineUsers, ['_id', user._id]);
          io.emit('ALL_ONLINE_USERS', onlineUsers);
        });

        client.on('ALL_ONLINE_USERS', () => {
          io.emit('ALL_ONLINE_USERS', onlineUsers);
          console.log('online', onlineUsers.length);
        });

        client.on('NEW_USER', user => {
          if (_.findIndex(onlineUsers, ['_id', user._id]) === -1) {
            delete user.token;
            onlineUsers.push({
              id: client.id,
              ...user
            });
          }
          io.emit('ALL_ONLINE_USERS', onlineUsers);
        })

        client.on('START_TYPING', (data) => {
          let receiverId = _.findIndex(onlineUsers, ['_id', data.to._id]);
          if (receiverId === -1) {
            console.log('SOCKET receiver tidak ditemukan!', data.to._id)
            return;
          }
          io.to(onlineUsers[receiverId].id).emit('START_TYPING', data);
        });
      
        client.on('STOP_TYPING', (data) => {
          let receiverId = _.findIndex(onlineUsers, ['_id', data.to._id])
          if (receiverId === -1) {
            console.log('SOCKET penerima tidak ditemukan!', data.to._id)
            return;
          }
          io.to(onlineUsers[receiverId].id).emit('STOP_TYPING', data);
        });
      
        client.on('SEND_MESSAGE', async ({from, to, messageContent}) => {
          if (_.isEmpty(messageContent) || !messageContent || !from._id || !to._id) {
            return;
          }

          let message = await MessageModel.create({
            content: messageContent,
            sender: from._id,
            receiver: to._id
          });
          message = await message.populate('receiver').populate('sender').execPopulate();

          let senderId = _.findIndex(onlineUsers, ['_id', from._id]);
          if (senderId === -1) {
            console.log('SOCKET sender tidak ditemukan!', from._id)
            return;
          }

          let receiverId = _.findIndex(onlineUsers, ['_id', to._id]);
          if (receiverId === false) {
            console.log('SOCKET receiver tidak ditemukan!', to._id)
            return;
          }

          io.to(onlineUsers[senderId].id).to(onlineUsers[receiverId].id).emit('NEW_MESSAGE', message);
        });

        client.on('RETRACT_MESSAGE', async ({sender, receiver, targetMessage}) => {
          let message = await MessageModel.findOne({ _id: targetMessage._id, sender: sender._id });

          if (!message) {
            console.log('Retract failed! Message not found');
            return;
          }

          if (! message.is_retracted) {
            message.retract();
          }

          let senderId = _.findIndex(onlineUsers, ['_id', sender._id]);
          if (senderId === -1) {
            console.log('SOCKET sender tidak ditemukan!', sender._id)
            return;
          }

          let receiverId = _.findIndex(onlineUsers, ['_id', receiver._id]);
          if (receiverId === -1) {
            console.log('SOCKET penerima tidak ditemukan!', receiver._id)
            return;
          }

          io.to(onlineUsers[senderId].id).to(onlineUsers[receiverId].id).emit('REFRESH_MESSAGE');
        });

        client.on('DELETE_MESSAGE', async ({sender, receiver, targetMessage}) => {
          let message = await MessageModel.findOne({ _id: targetMessage._id, sender: sender._id });

          if (!message) {
            console.log('Delete failed! Message not found');
            return;
          }

          message.delete();

          let senderId = _.findIndex(onlineUsers, ['_id', sender._id]);
          if (senderId === -1) {
            console.log('SOCKET sender tidak ditemukan!', sender._id)
            return;
          }

          let receiverId = _.findIndex(onlineUsers, ['_id', receiver._id]);
          if (receiverId === -1) {
            console.log('SOCKET penerima tidak ditemukan!', receiver._id)
            return;
          }

          io.to(onlineUsers[senderId].id).to(onlineUsers[receiverId].id).emit('REFRESH_MESSAGE');
        })
    });
};
