// /////////////////////////////////////////////////////////////////////////////
// TESTING AREA
// THIS IS AN AREA WHERE YOU CAN TEST YOUR WORK AND WRITE YOUR OWN TESTS
// /////////////////////////////////////////////////////////////////////////////

import request from 'supertest';
import '@babel/polyfill';
import api from '../src/api';
import db from '../src/db'
import models from '../src/db/model'

describe('process team api with for one position', () => {
    beforeEach(async () => {
        await db.sync();
    });

    afterEach(async () => {
        await models.Player.destroy({
            where: {},
            truncate: true,
            restartIdentity: true
        });

        await models.PlayerSkill.destroy({
            where: {},
            truncate: true,
            restartIdentity: true
        });

        await db.query('DELETE FROM `sqlite_sequence` WHERE `name` = "players"');
        await db.query('DELETE FROM `sqlite_sequence` WHERE `name` = "playerSkills"');
    });

    it('test sample', async () => {
        const data1 = {
            "name": "player1",
            "position": "defender",
            "playerSkills": [
                {
                "skill": "defense",
                "value": 60
                },
                {
                "skill": "speed",
                "value": 80
                }
            ]
        };
        await request(api).post('/api/player').send(data1);

        const data2 = {
            "name": "player2",
            "position": "midfielder",
            "playerSkills": [
            {
                "skill": "attack",
                "value": 60
            },
            {
                "skill": "speed",
                "value": 90
            }
            ]
        };
        await request(api).post('/api/player').send(data2);
        
        const data = [
            {
               "position": "midfielder",
                "mainSkill": "attack",
                "numberOfPlayers": 1
            },
            {
                "position": "defender",
                "mainSkill": "strength",
                "numberOfPlayers": 1
            }
        ];
        
        const response = await request(api).post('/api/team/process').send(data);

        expect(response).not.toBeNull();
        expect(response.body).toEqual([
            {
                "id": 2,
                "name": "player2",
                "position": "midfielder",
                "playerSkills": [
                    {
                        "id": 3,
                        "skill": "attack",
                        "value": 60,
                        "playerId": 2
                    }
                ]
            },
            {
                "id": 1,
                "name": "player1",
                "position": "defender",
                "playerSkills": [
                    {
                        "id": 2,
                        "skill": "speed",
                        "value": 80,
                        "playerId": 1,
                        "m_value": 80
                    }
                ]
            }
        ])
    });
});