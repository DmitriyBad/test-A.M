# test-A.M
test API A.M

## Review feedback

### Problems!!!/Mistakes!!/Improvements!
- !!! Project won't start - Cannot find module '../Auth-Catalog/middleware/passport'.
- !!! Credentials in public access files - You should use .env for credentials.
- !! Empty files in folter test/controllers - Finished project should be without commented code & empty files
- !! Missing global error handler.
- !! Import uses a separate query for each product.
- !! Why keys are not stored in one place - DB credentials in db.js, secret in configs.js...
- !! Not used logs - console.log('queryName - ' + req.query);
- ! Perhaps it is better to use some kind of function instead of manually writing an array of values - const values = [name, description, name_en, description_en, name_ru, description_ru, status, price, discount, hidden, barcode, req.params.id]
- ! In auth.js/login - When looking for a user by email - selection for a list of users and not for one. Using LIMIT 1 would be optimal.
- ! In auth.js/register - Move salt to constant before use in hash function.
