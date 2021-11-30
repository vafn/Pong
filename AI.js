class AI {
  /*
  static playerState = {
    goForBall,
    doNothig,
    gotoCenter,
    gotoUpperArea,
    gotoLowerArea
  };
  */
  /*
  goForBall
  doNothig  duration
  gotoCenter  waitAfter
  gotoUpperArea waitAfter
  gotoLowerArea waitAfter
  */
}
export class PlayerAI extends AI {
  constructor(player, ball) {
    super();
    this.player = player;
    this.ball = ball;
    this.state;
    this.difficulty = 1;
  }
  GetActions() {
    let actions = [];
    if (this.player.conceded)
      actions = this.GetKickBall();
    else {
      if ((this.player.right <= this.ball.left && this.ball.xV < 0) || (this.player.left >= this.ball.right && this.ball.xV > 0)) {
        //Ball is going toward player
        let  ballYError = 0 * (1 - 2 * Math.random());
        const hitAreaPercent = 2.6 - 0.222 * (this.difficulty - 1); //Center area of rocket to use for hitting the ball;
        const nonHitAreaPercent = (1 - hitAreaPercent) / 2;
        if (this.player.top + nonHitAreaPercent * this.player.height > this.ball.y + this.ball.height / 2 + ballYError)
          actions = [{do: 'moveUp', oneTime: true }]
        else if (this.player.bottom - nonHitAreaPercent * this.player.height < this.ball.y + this.ball.height / 2 + ballYError)
          actions = [{do: 'moveDown', oneTime: true }]
        else
          actions = [{do: 'nothing', oneTime: true }]
      } else {
        //Ball is going away from player
        if (this.player.top > this.ball.y)
          actions = [{do: 'moveUp', oneTime: true}]
        else if (this.player.bottom < this.ball.y)
          actions = [{do: 'moveDown', oneTime: true}]
        else
          actions = [{do: 'nothing', duration: 300}]
      }
    }
    return actions;
  }
  GetKickBall() {
    const moveType = Math.random();
    if (moveType < 0.5) {
      const r = Math.random();
      let dur = 500 * Math.random();
      let act = 'nothing';
      if (r < 0.33)
        act = 'moveDown';
      else if (r > 0.66)
        act = 'moveUp'
      else
          dur = 0;
      return [
        {'do': 'nothing', duration: 1500 * Math.random()},
        {'do': act, duration: dur},
        {'do': 'kickBall', duration: 1000},
        {'do': 'nothing', duration: 1500 * Math.random()}
      ];
    }
    else
      return [
        {'do': 'nothing', duration: 100},
        {'do': 'moveUp', duration: 200},
        {'do': 'moveDown', duration: 200},
        {'do': 'moveUp', duration: 200},
        {'do': 'moveDown', duration: 200},
        {'do': 'moveUp', duration: 200},
        {'do': 'moveDown', duration: 200},
        {'do': 'kickBall', duration: 1000},
        {'do': 'nothing', duration: 1500 * Math.random()}
      ];
  }

  GetMove() {
    const r = Math.floor(Math.random() * 4);
    if (r === 1)
      return 'up';
    else if (r === 2)
      return 'down';
    else if (r === 3)
      return 'shoot';
    return 'nothing';
  }
}
