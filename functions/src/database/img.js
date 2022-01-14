const _ = require('lodash');

const convertSnakeToCamel = require('../lib/convertSnakeToCamel');


const postImg = async (client, postId, idx, title, url) => {
    if(idx == 'imgTitle1'){
        const { rows } = await client.query(

            `
        
            INSERT INTO img
            (post_id, img_title1, img_url1)
        
            VALUES
        
            ($1, $2, $3)
        
            RETURNING id
            `,
        
            [postId, title, url],
        
            );
        
            return convertSnakeToCamel.keysToCamel(rows[0]);
    }
    else if(idx == 'imgTitle2'){
        const { rows } = await client.query(

            `
        
            INSERT INTO img
            (post_id, img_title2, img_url2)
        
            VALUES
        
            ($1, $2, $3)
        
            RETURNING id
            `,
        
            [postId, title, url],
        
            );
        
            return convertSnakeToCamel.keysToCamel(rows[0]);
    }

};

const postImgs = async (client, postId, imgTitle1, imgUrl1, imgTitle2, imgUrl2) => {

    const { rows } = await client.query(

        `
    
        INSERT INTO img
        (post_id, img_title1, img_url1, img_title2, img_url2)
    
        VALUES
    
        ($1, $2, $3, $4, $5)
    
        RETURNING id
        `,
    
        [postId, imgTitle1, imgUrl1, imgTitle2, imgUrl2],
    
        );
    
        return convertSnakeToCamel.keysToCamel(rows[0]);


};

const updateImgTitle = async (client, postId, idx, title) => {
    const { rows:existingRows } = await client.query(

        `
    
        SELECT  * FROM img
        
        WHERE post_id=$1

        `,
    
        [postId],
    
    );
    if(!existingRows[0]){ return ; }
    if(idx == 'imgTitle1'){
    const { rows } = await client.query(

    `

    UPDATE img

    SET img_title1=$1
    
    WHERE post_id=$2

    RETURNING *
    `,

    [title, postId],

    );
    return convertSnakeToCamel.keysToCamel(rows[0]);
    }
    if(idx == 'imgTitle2'){
    const { rows } = await client.query(

        `
 
        UPDATE img

        SET img_title2=$1
        
        WHERE post_id=$2
    
        RETURNING *
        `,
    
        [title, postId],
        );
        return convertSnakeToCamel.keysToCamel(rows[0]);
    }
};


const updateImg = async (client, postId, idx, title, url) => {

    const { rows:existingRows } = await client.query(

        `
        SELECT FROM img 
        WHERE post_id=$1

        `,
    
        [postId],
    
    );
    if(existingRows.length === 0){
    const { rows:newRows } = await client.query(

        `
        INSERT INTO img
        (post_id)
    
        VALUES
    
        ($1)
    
        RETURNING id

        `,
    
        [postId],
    
    );
    }
    if(idx == 'imgTitle1'){
    const { rows } = await client.query(

    `

    UPDATE img

    SET img_title1=$1, img_url1=$2
    
    WHERE post_id=$3

    RETURNING *
    `,

    [title, url, postId],

    );
    return convertSnakeToCamel.keysToCamel(rows[0]);
    }
    if(idx == 'imgTitle2'){
    const { rows } = await client.query(

        `
 
        UPDATE img

        SET img_title2=$1, img_url2=$2
        
        WHERE post_id=$3
    
        RETURNING *
        `,
    
        [title, url, postId],
        );
        return convertSnakeToCamel.keysToCamel(rows[0]);
    }
};


const deleteImg = async (client, postId, idx) => {
    if(idx == 'imgUrl1'){
    const { rows } = await client.query(

    `

    UPDATE img

    SET img_title1=null, img_url1=null
    
    WHERE post_id=$1

    RETURNING *
    `,

    [postId],

    );

    }
    if(idx == 'imgUrl2'){
    const { rows } = await client.query(

        `
    
        UPDATE img
    
        SET img_title2=null, img_url2=null
        
        WHERE post_id=$1
    
        RETURNING *
        `,
    
        [postId],
    
        );
    }
   const { rows:existingRows } = await client.query(

        `
    
        SELECT  * FROM img
        
        WHERE post_id=$1

        `,
    
        [postId],
    
    );

    if(existingRows[0].img_title1==null && existingRows[0].img_title2==null ){
        const { rows:deleteRows } = await client.query(

            `
        
           DELETE FROM img
            
            WHERE post_id=$1
        
            RETURNING *
            `,
        
            [postId],
        
        );
        return convertSnakeToCamel.keysToCamel(deleteRows[0]);
    }

};

const deleteImgs = async (client, postId) => {
    
   const { rows:existingRows } = await client.query(

        `
    
        SELECT  * FROM img
        
        WHERE post_id=$1

        `,
    
        [postId],
    
    );

    if(existingRows){
        const { rows:deleteRows } = await client.query(

            `
        
           DELETE FROM img
            
            WHERE post_id=$1
        
            RETURNING *
            `,
        
            [postId],
        
        );
        return convertSnakeToCamel.keysToCamel(deleteRows[0]);
    }
    else return;
};

module.exports = { postImg, postImgs, deleteImg, updateImgTitle, updateImg };