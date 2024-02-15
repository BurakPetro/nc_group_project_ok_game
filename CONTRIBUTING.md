##WORKFLOW

When undertaking a new sprint do the following

1. `git checkout main`
2. `git pull origin main`
3. `git checkout -b <your Branch Name>` for naming branches see recourse below
4. -- DO SOME WORK -- commits for naming branches see recourse below
5. `Git push origin <your Branch Name>`
6. Create pull request
7. Have someone from the team review the code if required
8. Merge PR on github
9. Delete branch on github

Note we may add 'dev' branch later down the line if required

```mermaid
---
title: OKAY-PLAY work flow
---
gitGraph
       commit id: "1"
       commit id: "2"
       branch feat/something1
       checkout feat/something1
       commit id: "5"
       commit id: "8"
       commit id: "9"
       commit id: "10"
       checkout main
       merge feat/something1 id: "add foo1"
       branch feat/something2
       checkout feat/something2
       commit id: "11"
       commit id: "12"
       checkout main
       merge feat/something2 id: "add foo2"
       checkout main
```

Additional tips:

- `Git pull origin main` **minimum** every morning before you start
- When adding reminder into the code for something that needs to be done later start with `// TODO` as this will allow us to easily figure out needs to be done and add it to Trello board
- Ensure code has been formatted before merging. You can do this automatically with Prettier
- removing unnessory console.logs before committing to 'main'

###Recourse
[Naming Git hub branch](https://stackoverflow.com/a/6065944)
[Working with branches](https://www.atlassian.com/git/tutorials/comparing-workflows/gitflow-workflow)

<!-- TODO add in naming commits -->
