module Fora (foraComments, foraCommentsWith) where

import Hakyll

-- | Default Fora comments embed context.
--   Add to your site context with:
--
--     foraComments "YOUR_SITE_KEY"
--
foraComments :: String -> Context a
foraComments siteKey = foraCommentsWith siteKey "https://giga.mobile" Nothing Nothing

-- | Fora comments with custom origin and optional page ID.
--
--     foraCommentsWith "KEY" "https://giga.mobile" (Just $path$)
--
foraCommentsWith :: String -> String -> Maybe String -> Context a
foraCommentsWith siteKey origin mbPageId = field "fora" $ \_ -> do
  let pageIdAttr = case mbPageId of
        Just pid -> " data-page-identifier=\"" ++ pid ++ "\""
        Nothing  -> ""
  return $
    "<div id=\"fora-comments\"></div>\n\
    \<script src=\"" ++ origin ++ "/embed.js\"\n\
    \  data-site-key=\"" ++ siteKey ++ "\"\n\
    \  data-theme=\"auto\"" ++ pageIdAttr ++ "\n\
    \  data-container-id=\"fora-comments\"\n\
    \></script>"
