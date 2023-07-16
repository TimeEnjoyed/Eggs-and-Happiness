export const ROT_0 = 0;
export const ROT_90 = 1;
export const ROT_180 = 2;
export const ROT_270 = 3;

export const ROT_0_LOOKUP = [0, 1, 2, 3, 4, 5, 6, 7, 8];
export const ROT_90_LOOKUP = [2, 5, 8, 1, 4, 7, 0, 3, 6];
export const ROT_270_LOOKUP = [6, 3, 0, 7, 4, 1, 8, 5, 2];




//Blocks
export const BT_EMPTY = 0;
export const BT_COLOR_MIN = 1;
export const BT_COLOR_MAX = 3;

export const BT_CLOCK_A_MIN = 4;
export const BT_CLOCK_A_MAX = 7;

export const BT_CLOCK_B_MIN = 8;
export const BT_CLOCK_B_MAX = 11;



export const COL_LOOKUP = {
    "A": 0,
    "B": 1,
    "C": 2,
    "D": 3
};

//function
export const getNewIndexForARotation = (idx, rot) => {
    if (rot == ROT_0) {
        return idx;
    } else if (rot == ROT_90) {
        return ROT_90_LOOKUP[idx];

    } else if (rot == ROT_270) {
        return ROT_270_LOOKUP[idx];
    }
}

export const getNewValForRotation = (val, rot) => {
    //colors don't need to be rotation, only the new location (idx) is important
    if ((val >= BT_COLOR_MIN && val <= BT_COLOR_MAX) || rot == ROT_0) {
        return val;
    }



    if (val >= BT_CLOCK_A_MIN && val <= BT_CLOCK_A_MAX) {



        if (rot == ROT_90) {

            val = val + 1;

            if (val > BT_CLOCK_A_MAX) {
                val = BT_CLOCK_A_MIN;

            }
            return val;

        } else if (rot == ROT_270) {
            val = val - 1;
            if (val < BT_CLOCK_A_MIN) {
                val = BT_CLOCK_A_MAX;
            }
            return val;
        }


    } else if (val >= BT_CLOCK_B_MIN && val <= BT_CLOCK_B_MAX) {

        if (rot == ROT_90) {

            val = val + 1;

            if (val > BT_CLOCK_B_MAX) {
                val = BT_CLOCK_B_MIN;

            }
            return val;

        } else if (rot == ROT_270) {
            val = val - 1;
            if (val < BT_CLOCK_B_MIN) {
                val = BT_CLOCK_B_MAX;
            }
            return val;
        }

    }


}




/*********************************************************
 * Convert row & column Coordinates into an array index
 **********************************************************/
const colRowToIdx = (gridSize, c, r) => {
    let colNum = COL_LOOKUP[c];
    return (gridSize * r) + colNum;
};


export const parsePlaceBlock = (gridSize, cmdTxtIn) => {

    let cmdTxt = cmdTxtIn.toUpperCase().trim();

    if (cmdTxt.length != 3) {
        console.log("invalid cmd length");
        return false;
    }

    //    const regex = /^[A-C][1-3][QWE]$/;
    const regex = /^[ABC][123][QWE]$/i;

    if (!regex.test(cmdTxt)) {
        console.log("invalid regexAAA");
        return false;
    }


    let colNum = COL_LOOKUP[cmdTxt[0]];
    let rowNum = parseInt(cmdTxt[1]) - 1;
    let pBlock = cmdTxt[2];


    return {
        col: colNum,
        row: rowNum,
        pb: pBlock,
        idx: (gridSize * rowNum) + colNum
    }


    //let colNum = COL_LOOKUP[c];
    //return (gridSize * r) + colNum;
};