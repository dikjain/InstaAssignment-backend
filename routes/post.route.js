import express from "express";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();

// Get Instagram media posts for a user
router.get("/instagram-media", async (req, res) => {
  try {
    const { ig_user_id, access_token, fields } = req.query;
    
    if (!ig_user_id || !access_token) {
      return res.status(400).json({ error: "Instagram user ID and access token are required" });
    }
    
    const fieldsToFetch = fields || "id,caption,media_type,media_url,thumbnail_url,timestamp,permalink,like_count,comments_count";
    
    const mediaResponse = await axios.get(
      `https://graph.facebook.com/v22.0/${ig_user_id}/media`,
      {
        params: {
          fields: fieldsToFetch,
          access_token
        }
      }
    );
    
    res.json(mediaResponse.data);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch Instagram media" });
  }
});

// Get comments on an Instagram post
router.get("/instagram-comments", async (req, res) => {
  try {
    const { media_id, access_token, fields } = req.query;
    
    if (!media_id || !access_token) {
      return res.status(400).json({ error: "Media ID and access token are required" });
    }
    
    const fieldsToFetch = fields || "id,text,timestamp,username,from,replies";
    
    const commentsResponse = await axios.get(
      `https://graph.facebook.com/v22.0/${media_id}/comments`,
      {
        params: {
          fields: fieldsToFetch,
          access_token
        }
      }
    );
    
    res.json(commentsResponse.data);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch Instagram comments" });
  }
});

// Reply to a comment on an Instagram post
router.post("/instagram-reply", async (req, res) => {
  try {
    const { comment_id, message, access_token } = req.body;
    
    if (!comment_id || !message || !access_token) {
      return res.status(400).json({ error: "Comment ID, message, and access token are required" });
    }
    
    const replyResponse = await axios.post(
      `https://graph.facebook.com/v22.0/${comment_id}/replies`,
      {
        message,
        access_token
      }
    );
    
    res.json(replyResponse.data);
  } catch (error) {
    res.status(500).json({ error: "Failed to post Instagram reply" });
  }
});

export default router;
