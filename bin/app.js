#!/usr/bin/env node
const fs = require('fs');

const jsonCsv = require('json-2-csv');
if(process.argv[2]){
    const hashtagFile = process.argv[2];
    const ogData = require(hashtagFile);
    let data = ogData.map(item => {
        const {
            shortcode: post_hash,
            owner: { username: account_name },
            edge_media_preview_like: { count: likes },
            edge_media_preview_comment: { count: comments },
            is_video,
            edge_media_to_caption,
            taken_at_timestamp
    
        } = item.shortcode_media;
        let caption = "";
        let dateTaken = "";
        try {
            caption = edge_media_to_caption.edges[0].node.text;
            var utcSeconds = 1234567890;
            var d = new Date(0); // The 0 there is the key, which sets the date to the epoch
            dateTaken = d.setUTCSeconds(taken_at_timestamp*1000).toISOstring();
        } catch (e) { }
    
        return { post_hash, account_name, likes, comments, url: `https://www.instagram.com/p/${post_hash}`, post_type: is_video ? "Video" : "Photo", caption, posted: dateTaken };
    })
    
    jsonCsv.json2csv(data, (err, csvData) => {
        fs.writeFileSync(`${hashtagFile.replace(".json", "")}.csv`, csvData)
    })
}else{
    console.warn("No file selected put the file path after the call")
}
