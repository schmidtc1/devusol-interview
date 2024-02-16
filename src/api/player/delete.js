// ---------------------------------------------------------------------------------------------
// YOU CAN FREELY MODIFY THE CODE BELOW IN ORDER TO COMPLETE THE TASK
// ---------------------------------------------------------------------------------------------

import Player from '../../db/model/player'
import PlayerSkill from '../../db/model/playerSkill'

export default async (req, res) => {
  try {
    const id = req.params.id;
    await Player.findOne({
      where: { id: id }
    }).then(async (player) => {
      await player.destroy();
    });
  
    await Player.findAll({
      include: PlayerSkill
    }).then(async (players) => {
      await res.json(players)
    });
  } catch (error) {
    await res.json({"message": error})
  }
}
