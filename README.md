# Deployment

To publish this site on GitHub Pages:

1. Create a repository on GitHub. If you want a user site use the name `USERNAME.github.io` (replace `USERNAME`).
2. Add the remote and push from this project:

```bash
git remote add origin https://github.com/USERNAME/REPO.git
git branch -M main
git push -u origin main
```

3. The included GitHub Actions workflow (`.github/workflows/deploy.yml`) will run on push to `main` and publish the repository content to GitHub Pages automatically.

Notes:

- Replace `USERNAME` and `REPO` in the commands above.
- If you prefer to enable Pages manually, go to the repository Settings → Pages and select `gh-pages` / `main` as needed.
