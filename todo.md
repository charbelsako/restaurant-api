# TODO

## Public:

- [ ] Refresh token
- [x] Signup
- [x] Login
- [x] View available menu items and categories
  - [x] Pagination
  - [x] Search
  - [x] Filter by category

## Private:

- [ ] Revoke Token
- [x] Disable/enable User
- [x] View/Update user profile (can't change his email)
- [x] list/add/update/delete addresses (user)
- [x] list/add/update/delete branches (admin)
- [x] Add/update/delete menu categories (admin)
- [x] Add/update/delete menu items (admin)
- [ ] Add image to local repo (admin)
- [x] List/Create/Update order
  - [x] the restaurant branch is selected automatically based on client location, client should be withing 5km of the branch
  - [x] by default all orders have pending status `default: "pending"`
  - [x] The admin can accept or reject orders
  - [ ] only pending orders can be canceled by the client
