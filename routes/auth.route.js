import express from "express";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();

router.get("/callback", async (req, res) => {
  try {
    const code = req.query.code;
    
    const response = await axios.get("https://graph.facebook.com/v22.0/oauth/access_token", {
      params: {
        client_id: process.env.FACEBOOK_CLIENT_ID,
        client_secret: process.env.FACEBOOK_CLIENT_SECRET,
        redirect_uri: process.env.FACEBOOK_REDIRECT_URI || "http://localhost:3000/",
        code,
      },
    });

    const accessToken = response.data.access_token;
    
    try {
      const userDataResponse = await axios.get("https://graph.facebook.com/v22.0/me", {
        params: {
          fields: "id,name,email",
          access_token: accessToken
        }
      });
      
      res.json({
        ...response.data,
        user: userDataResponse.data
      });
    } catch (profileError) {
      res.json(response.data);
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to exchange code for access token" });
  }
});

router.get("/instagram-accounts", async (req, res) => {
  try {
    const { access_token } = req.query;
    
    if (!access_token) {
      return res.status(400).json({ error: "Access token is required" });
    }
    
    const pagesResponse = await axios.get("https://graph.facebook.com/v22.0/me/accounts", {
      params: { access_token }
    });
    
    const pages = pagesResponse.data.data;
    const instagramAccounts = [];
    
    for (const page of pages) {
      try {
        const instagramResponse = await axios.get(
          `https://graph.facebook.com/v22.0/${page.id}`,
          { 
            params: { 
              fields: "instagram_business_account",
              access_token: page.access_token 
            } 
          }
        );
        
        if (instagramResponse.data && instagramResponse.data.instagram_business_account) {
          const igBusinessId = instagramResponse.data.instagram_business_account.id;
          
          const igDetailsResponse = await axios.get(
            `https://graph.facebook.com/v22.0/${igBusinessId}`,
            {
              params: {
                fields: "name,username,profile_picture_url,biography,followers_count,follows_count,media_count",
                access_token: page.access_token
              }
            }
          );
          
          instagramAccounts.push({
            pageId: page.id,
            pageName: page.name,
            pageAccessToken: page.access_token,
            instagramAccountId: igBusinessId,
            instagramDetails: igDetailsResponse.data
          });
        }
      } catch (err) {
        // Skip pages without Instagram accounts
      }
    }
    
    res.json({ instagramAccounts });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch Instagram accounts" });
  }
});

router.get("/extend-token", async (req, res) => {
  try {
    const { access_token } = req.query;
    
    if (!access_token) {
      return res.status(400).json({ error: "Access token is required" });
    }
    
    const response = await axios.get("https://graph.facebook.com/v22.0/oauth/access_token", {
      params: {
        grant_type: "fb_exchange_token",
        client_id: process.env.FACEBOOK_CLIENT_ID,
        client_secret: process.env.FACEBOOK_CLIENT_SECRET,
        fb_exchange_token: access_token
      }
    });
    
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: "Failed to extend access token" });
  }
});

export default router;
