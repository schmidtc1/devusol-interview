// ---------------------------------------------------------------------------------------------
// YOU CAN FREELY MODIFY THE CODE BELOW IN ORDER TO COMPLETE THE TASK
// ---------------------------------------------------------------------------------------------

import Player from '../../db/model/player'
import PlayerSkill from '../../db/model/playerSkill'

export default async (req, res) => {
  try {
    const payload = req.body;

    let playerName = payload.name;
    let playerPosition = payload.position;
    let playerSkills = payload.playerSkills;
    if (playerSkills.length < 1) {
      await res.json({"message": "Need at least one skill"});
      return;
    }
  
    /* Sync database as we create Players and their Skills */
    Player.hasMany(PlayerSkill);
    PlayerSkill.belongsTo(Player);
    /* Create Player model and set PlayerSkill model */
  
    await Player.create({name: playerName, position: playerPosition
    }).then(async (newPlayer) => {
      return newPlayer.addPlayerSkills(await PlayerSkill.bulkCreate(playerSkills));
    }).then(async (newPlayer) => {
      return await Player.findOne({
        where: {name: newPlayer.name},
        include: PlayerSkill
      })
    }).then(async (newPlayer) => {
      await res.send(newPlayer);
    });
  } catch (error) {
    await res.json({"message": error})
  }
}
