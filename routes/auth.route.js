import express from "express";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();

router.get("/callback", async (req, res) => {
  console.log("Callback endpoint hit");

  try {
    const code = req.query.code;
    console.log("Received code:", code);

    const response = await axios.get("https://graph.facebook.com/v22.0/oauth/access_token", {
      params: {
        client_id: process.env.FACEBOOK_CLIENT_ID,
        client_secret: process.env.FACEBOOK_CLIENT_SECRET,
        redirect_uri: process.env.FACEBOOK_REDIRECT_URI || "http://localhost:3000/",
        code,
      },
    });

    console.log("Access token response:", response.data);

    // Get user profile information after obtaining access token
    const accessToken = response.data.access_token;
    
    try {
      // Get user profile data using the access token
      const userDataResponse = await axios.get("https://graph.facebook.com/v22.0/me", {
        params: {
          fields: "id,name,email",
          access_token: accessToken
        }
      });
      
      console.log("User profile data:", userDataResponse.data);
      
      // Return both the access token and user data
      res.json({
        ...response.data,
        user: userDataResponse.data
      });
    } catch (profileError) {
      console.error("Error fetching user profile:", profileError.response?.data || profileError.message);
      // Still return the access token even if profile fetch fails
      res.json(response.data);
    }
  } catch (error) {
    console.error(
      "Error exchanging code for access token:",
      error.response?.data || error.message
    );
    res.status(500).json({ error: "Failed to exchange code for access token" });
  }
});

// Add a new route to get Instagram account info
router.get("/instagram-accounts", async (req, res) => {
  console.log("Instagram accounts endpoint hit");
  try {
    const { access_token } = req.query;
    
    console.log("Using access token:", access_token ? "Token provided" : "No token");
    
    if (!access_token) {
      return res.status(400).json({ error: "Access token is required" });
    }
    
    // First get the user's Facebook pages
    const pagesResponse = await axios.get("https://graph.facebook.com/v22.0/me/accounts", {
      params: { access_token }
    });
    
    console.log("Facebook pages response:", pagesResponse.data);
    
    // For each page, check if it has an Instagram Business account connected
    const pages = pagesResponse.data.data;
    const instagramAccounts = [];
    
    for (const page of pages) {
      try {
        console.log(`Checking Instagram account for page: ${page.name} (${page.id})`);
        
        // Get Instagram business account ID for this page
        const instagramResponse = await axios.get(
          `https://graph.facebook.com/v22.0/${page.id}`,
          { 
            params: { 
              fields: "instagram_business_account",
              access_token: page.access_token 
            } 
          }
        );
        
        console.log(`Instagram business account response for page ${page.name}:`, instagramResponse.data);
        
        if (instagramResponse.data && instagramResponse.data.instagram_business_account) {
          const igBusinessId = instagramResponse.data.instagram_business_account.id;
          
          // Get detailed Instagram account information
          const igDetailsResponse = await axios.get(
            `https://graph.facebook.com/v22.0/${igBusinessId}`,
            {
              params: {
                fields: "name,username,profile_picture_url,biography,followers_count,follows_count,media_count",
                access_token: page.access_token
              }
            }
          );
          
          console.log(`Instagram details for account ${igBusinessId}:`, igDetailsResponse.data);
          
          instagramAccounts.push({
            pageId: page.id,
            pageName: page.name,
            pageAccessToken: page.access_token,
            instagramAccountId: igBusinessId,
            instagramDetails: igDetailsResponse.data
          });
          
          console.log(`Added Instagram account for page ${page.name}`);
        }
      } catch (err) {
        console.log(`No Instagram account for page ${page.name}:`, err.message);
      }
    }
    
    console.log("Returning Instagram accounts:", instagramAccounts);
    res.json({ instagramAccounts });
  } catch (error) {
    console.error("Error fetching Instagram accounts:", error.response?.data || error.message);
    res.status(500).json({ error: "Failed to fetch Instagram accounts" });
  }
});

// Extend short-lived token to long-lived token
router.get("/extend-token", async (req, res) => {
  console.log("Extend token endpoint hit");
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
    
    console.log("Extended token response:", response.data);
    
    res.json(response.data);
  } catch (error) {
    console.error("Error extending access token:", error.response?.data || error.message);
    res.status(500).json({ error: "Failed to extend access token" });
  }
});

export default router;
