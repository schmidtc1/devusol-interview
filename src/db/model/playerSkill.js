// ---------------------------------------------------------------------------------------------
// YOU CAN MODIFY THE CODE BELOW IN ORDER TO COMPLETE THE TASK
// YOU SHOULD NOT CHANGE THE EXPORTED VALUE OF THIS FILE
// ---------------------------------------------------------------------------------------------

import Sequelize from 'sequelize';
import database from '../index';

const PlayerSkill = database.define('playerSkill', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    skill: {
        type: Sequelize.STRING(200),
        validate: {
            isIn: {
                args: [['defense', 'attack', 'speed', 'strength', 'stamina']],
                msg: "Invalid value for skill."
            }
        }
    },
    value: {
        type: Sequelize.INTEGER
    },
    playerId: {
        type: Sequelize.INTEGER
    }
}, {
    timestamps: false
})

PlayerSkill.associate = (models) => {
    models.PlayerSkill.belongsTo(models.Player);
}

export default PlayerSkill;