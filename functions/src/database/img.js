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

const deleteImg = async (client, postId, title, url) => {

    const { rows } = await client.query(

    `

    INSERT INTO img
    (post_id, title, url)

    VALUES

    ($1, $2, $3)

    RETURNING id
    `,

    [postId, title, url],

    );

    return convertSnakeToCamel.keysToCamel(rows[0]);

};

module.exports = { postImg, postImgs, deleteImg };