const db = require('../database/connection');

module.exports = {
    async index(request, response) {

        const { page = 1 } = request.query;

        const [count] = await db('incidents').count();

        const incidents = await db('incidents')
            .innerJoin('ongs', 'incidents.ong_id', '=', 'ongs.id')
            .limit(5)
            .offset((page - 1) * 5)
            .select([
                'incidents.*',
                'ongs.name',
                'ongs.whatsapp',
                'ongs.email',
                'ongs.city',
                'ongs.uf'
            ]);

        response.header('X-Total-Count', count['count(*)']);

        response.json(incidents);
    },
    async create(request, response) {
        const { title, description, value } = request.body;

        const ong_id = request.headers.authorization;

        const [id] = await db('incidents').insert({
            title,
            description,
            value,
            ong_id
        });

        return response.json({ id });
    },
    async delete(request, response) {
        const ong_id = request.headers.authorization;
        const { id } = request.params;

        const incident = await db('incidents')
            .where('id', id)
            .select('ong_id')
            .first();

        if (!ong_id || !incident.ong_id || incident.ong_id != ong_id) {
            return response.status(401).json({ error: 'Operation not permitted' });
        }

        await db('incidents').where({ id }).delete();

        return response.status(204).send();
    }
};