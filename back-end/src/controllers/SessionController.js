const db = require('../database/connection');

module.exports = {
    async create(request, response) {
        const { id } = request.body;

        const ong = await db('ongs')
            .where({ id })
            .select()
            .first();

        if(!ong) {
            return response.status(400).json({ error: 'No ONG found this ID' });
        }

        return response.json(ong);
    }
};