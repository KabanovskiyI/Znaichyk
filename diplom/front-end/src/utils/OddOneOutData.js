import CardBg1 from '../../public/assets/images/OddOneOut/Cards_1.svg';
import CardBg2 from '../../public/assets/images/OddOneOut/Cards_2.svg';
import CardBg3 from '../../public/assets/images/OddOneOut/Cards_3.svg';
import CardBg4 from '../../public/assets/images/OddOneOut/Cards_4.svg';

import S1_Enemy from '../../public/assets/images/OddOneOut/set_1/enemy.svg';
import S1_Ally1 from '../../public/assets/images/OddOneOut/set_1/ally_cat.svg';
import S1_Ally2 from '../../public/assets/images/OddOneOut/set_1/ally_dog.svg';
import S1_Ally3 from '../../public/assets/images/OddOneOut/set_1/ally_pig.svg';

import S2_Enemy from '../../public/assets/images/OddOneOut/set_2/enemy.svg';
import S2_Ally1 from '../../public/assets/images/OddOneOut/set_2/ally_bus.svg';
import S2_Ally2 from '../../public/assets/images/OddOneOut/set_2/ally_car.svg';
import S2_Ally3 from '../../public/assets/images/OddOneOut/set_2/ally_taxy.svg';

import S3_Enemy from '../../public/assets/images/OddOneOut/set_3/enemy.svg';
import S3_Ally1 from '../../public/assets/images/OddOneOut/set_3/ally_teddy.svg';
import S3_Ally2 from '../../public/assets/images/OddOneOut/set_3/ally_car.svg';
import S3_Ally3 from '../../public/assets/images/OddOneOut/set_3/ally_rocket.svg';

import S4_Enemy from '../../public/assets/images/OddOneOut/set_4/enemy.svg';
import S4_Ally1 from '../../public/assets/images/OddOneOut/set_4/ally_backpack.svg';
import S4_Ally2 from '../../public/assets/images/OddOneOut/set_4/ally_notebook.svg';
import S4_Ally3 from '../../public/assets/images/OddOneOut/set_4/ally_pencil.svg';

import S5_Enemy from '../../public/assets/images/OddOneOut/set_5/enemy.svg';
import S5_Ally1 from '../../public/assets/images/OddOneOut/set_5/ally_ball.svg';
import S5_Ally2 from '../../public/assets/images/OddOneOut/set_5/ally_carrot.svg';
import S5_Ally3 from '../../public/assets/images/OddOneOut/set_5/ally_pumpkin.svg';

export const cardBackgrounds = [CardBg1, CardBg2, CardBg3, CardBg4];

export const gameSets = [
  {
    id: 1,
    enemy: S1_Enemy,
    allies: [S1_Ally1, S1_Ally2, S1_Ally3] 
  },
  {
    id: 2,
    enemy: S2_Enemy,
    allies: [S2_Ally1, S2_Ally2, S2_Ally3]
  },
  {
    id: 3,
    enemy: S3_Enemy,
    allies: [S3_Ally1, S3_Ally2, S3_Ally3]
  },
  {
    id: 4,
    enemy: S4_Enemy,
    allies: [S4_Ally1, S4_Ally2, S4_Ally3]
  },
  {
    id: 5,
    enemy: S5_Enemy,
    allies: [S5_Ally1, S5_Ally2, S5_Ally3]
  },
];