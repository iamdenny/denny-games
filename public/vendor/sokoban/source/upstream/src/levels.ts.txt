// Original mini-levels, ordered by difficulty. Standard text format:
// # wall, @ player, $ box, . goal, * box on goal, + player on goal.
//
// Every level is verified SOLVABLE by the test suite: the BFS solver must find
// a solution and its replay must reach the won state. Editing a level here
// without re-running the tests is how you ship an impossible puzzle — don't.

export interface LevelDef {
  name: string;
  text: string;
}

export const LEVELS: LevelDef[] = [
  {
    name: '1. First push',
    text: `#####
#@$.#
#####`,
  },
  {
    name: '2. Two rooms',
    text: `#######
#.@ $ #
# $#  #
#   . #
#######`,
  },
  {
    name: '3. Around the pillar',
    text: `######
#    #
# ## #
# $. #
# @# #
#    #
######`,
  },
  {
    name: '4. Pair',
    text: `#######
#     #
# $$@ #
# ..  #
#     #
#######`,
  },
  {
    name: '5. Storage row',
    text: `########
#      #
# $ $ $#
#@     #
# . . .#
#      #
########`,
  },
  {
    name: '6. The hook',
    text: `#######
##  ..#
#  $$ #
#  @  #
##    #
#######`,
  },
];
