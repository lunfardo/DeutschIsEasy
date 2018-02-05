Deutsch is easy APP!

Allows you to choose between different translations api to get the best definitions for your german words!

As for now, you can only choose between https://de.pons.com/ (site recommended by Goethe Institut) and https://glosbe.com/ (a big translation database where the content is made by users).  I will add Google Translate in the future.

TODO:
-Comment every function.
-Test every function.
-After change translate provider, it should update the interface with the new translation
-Better error handling. So far only the requests that produce empty results are handle. Nothing about network errors.
-Better interface:
    *The user should know when something goes wrong.
    *Better interface for choose translate provider

Note:
-.env is not in the ".gitignore" for practical reasons, it will be in later stages.
-Get your own key from https://en.pons.com/open_dict/public_api  and put in the var "APIKey" inside .env