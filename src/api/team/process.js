// ---------------------------------------------------------------------------------------------
// YOU CAN FREELY MODIFY THE CODE BELOW IN ORDER TO COMPLETE THE TASK
// ---------------------------------------------------------------------------------------------
import Sequelize from 'sequelize';
import Player from '../../db/model/player'
import PlayerSkill from '../../db/model/playerSkill'

export default async (req, res) => {
  try {
    let team = []

    const teamRequest = req.body;
    for (let i = 0; i < teamRequest.length; i++) {
      await Player.findAll({
        where: {
          position: teamRequest[i].position,
        },
        include: [{
          model: PlayerSkill,
          where: {
            skill: teamRequest[i].mainSkill
          }
        }],
      }).then(async (players) => { // find player with highest skill level
        let current = players[0];
        players.forEach((player) => {
          current.playerSkills.forEach((currSkill) => {
            player.playerSkills.forEach((skill) => {
              if (skill == teamRequest[i].mainSkill && currSkill == teamRequest[i].mainSkill) {
                if (currSkill.value < skill.value) {
                  current = player;
                }
              }
              else if (skill == teamRequest[i].mainSkill && currSkill !== teamRequest[i].mainSkill) {
                current = player;
              }
            })
          })
        })
        if (current !== undefined) {
          team.push(current);
        }
        else { 
          await Player.findOne({ // finds player with max skill value
            where: {
              position: teamRequest[i].position,
            },
            include: [{
              model: PlayerSkill, 
              attributes: {
                include: [
                  [Sequelize.fn('max', Sequelize.col('value')), 'm_value']
                ]
              }
            }]
          }).then((player) => {
            team.push(player);
          })
        }
      });
      if (i == teamRequest.length - 1) {
        await res.send(team);
      }
    }
  } catch (error) {
    await res.send({"message": error});
  }
}
