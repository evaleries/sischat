const {BadRequestError, ForbiddenError, NotFoundError} = require('express-json-api-error-handler');
const MessageModel = require('../models/message');
const UserModel = require('../models/user');

module.exports = {
    conversationWithUser: async function (req, res, next) {
        try {
            if (!req.params.user_id) throw new BadRequestError('user_id kosong. Gunakan field _id');

            const conversations = await MessageModel.find({
                $or: [
                    {$and: [{sender: req.user._id}, {receiver: req.params.user_id}]},
                    {$and: [{sender: req.params.user_id}, {receiver: req.user._id}]}
                ]
            })
                .populate('sender', '_id username')
                .populate('receiver', '_id username');

            res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
            return res.json({error: false, conversations})

        } catch (error) {
            return next(error);
        }
    },
    recents: async function (req, res, next) {
        try {
            const messages = await MessageModel.aggregate([
                { $match: {$or: [{'sender._id': req.user._id}, {'receiver._id': req.user._id}]} },
                { $project: {"sender": "$sender", "content": "$content"} },
                { $sort: { _id: -1 } },
                { $group: {
                        '_id' : { 'sender': "$sender"},
                        "sender": { "$first" : "$sender" }, 
                        "content": {"$first": "$content"} 
                    }
                }
            ]);

            return res.json({error: false, messages});

        } catch (error) {
            return next(error);
        }

    },
    send: async function (req, res, next) {
        try {
            if (!req.body.receiver_id) throw new BadRequestError('Penerima pesan kosong!');
            if (!req.body.content) throw new BadRequestError('Isi pesan kosong!');

            const receiver = await UserModel.findOne({ _id: req.body.receiver_id }).select('_id username');

            if (!receiver) throw new BadRequestError('Penerima tidak ditemukan!');

            const message = await MessageModel.create({
                receiver: req.body.receiver_id,
                sender: req.user._id,
                content: req.body.content,
                is_retracted: false
            });

            return res.json({error: false, message, receiver})

        } catch (error) {
            return next(error);
        }
    },
    retract: async function (req, res, next) {
        try {
            if (!req.body.message_id) throw new BadRequestError('message_id kosong!');

            let message = await MessageModel.findOne({ _id: req.body.message_id }).populate('receiver', '_id username').populate('sender', '_id username');

            if (! message) throw new NotFoundError('Pesan yang dimaksud tidak ditemukan');

            if (req.user._id != message.sender._id) throw new ForbiddenError('Pesan yang dimaksud bukan milik anda.');

            if (message.is_retracted) return res.json({error: false, message})

            await message.update({
                content: '-PESAN DI TARIK-',
                is_retracted: true
            });

            message = await MessageModel.findOne({ _id: req.body.message_id }).populate('receiver', '_id username').populate('sender', '_id username');

            return res.json({error: false, message})

        } catch (error) {
            return next(error);
        }
    },
    delete: async function (req, res, next) {
        try {
            if (!req.body.message_id) throw new BadRequestError('message_id kosong!');

            let message = await MessageModel.findOne({ _id: req.body.message_id });

            if (! message) throw new NotFoundError('Pesan yang dimaksud tidak ditemukan');

            if (req.user._id != message.sender._id) throw new ForbiddenError('Pesan yang dimaksud bukan milik anda.');

            await message.delete();

            return res.json({error: false, message: 'Pesan telah dihapus'}).status(204);

        } catch (error) {
            return next(error);
        }
    }
}