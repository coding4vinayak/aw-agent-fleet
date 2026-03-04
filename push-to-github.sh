#!/bin/bash

# Push to GitHub script

echo "════════════════════════════════════════════"
echo "  Pushing AbetWorks Agent Fleet to GitHub"
echo "════════════════════════════════════════════"
echo ""

cd /teamspace/studios/this_studio

# Check if remote exists
if ! git remote | grep -q origin; then
    echo "Adding remote repository..."
    git remote add origin https://github.com/coding4vinayak/aw-agent-fleet.git
fi

# Rename branch to main
git branch -m main 2>/dev/null || true

# Stage all changes
echo "Staging files..."
git add .

# Commit
echo "Committing changes..."
git commit -m "Initial commit: AbetWorks Agent Fleet - Multi-tenant AI agent platform"

# Push to GitHub
echo ""
echo "Pushing to GitHub..."
echo "Note: You may need to enter your GitHub credentials"
echo ""

git push -u origin main

echo ""
echo "════════════════════════════════════════════"
echo "  Done!"
echo "════════════════════════════════════════════"
echo ""
echo "Repository: https://github.com/coding4vinayak/aw-agent-fleet"
echo ""
