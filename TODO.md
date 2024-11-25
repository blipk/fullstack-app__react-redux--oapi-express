#### TODO

# Frontend
- Better datetime management
- Form post imageURL fields to hosted storage endpoint before posting to the entity endpoint
- WYSIWYG Editor for blog etc content - [https://github.com/blipk/WYSIWYG-TipTap-React](https://github.com/blipk/WYSIWYG-TipTap-React)
- Slugs for blog URLs
- Adjust AppSliceState in regards to `status` and `messages` to integrate `recentFailureMessages`
- Unit tests against redux stores access and storage
- Integration test between redux stores and mock API


# Backend
- Templating refactor
- Both auth middlewares could possibly be merged
- In routes, in addition to the inline security functions, should also have modelObject pre-processors to constrain property values based on authorization roles
- Hosted storage endpoint - declare URL properties on models to use file type inputs on the frontend and have the update routes save the blob to a hosted storage and save the URL in the database
- Consider not returning 404 response with empty results
- Unit tests against mock database and route expectations


# Both
- Integration tests


# Deployment
- Tests on pre-commit hooks and GitHub Action runners
- github pages hosted typedoc (use GHA Workflow)
- windows powershell scripts (or just use docker?)
