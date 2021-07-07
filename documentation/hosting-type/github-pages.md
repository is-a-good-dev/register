<h2>Github pages</h2>
<p>You can create a github pages website by creating a new repo with the name <code>github-username.github.io</code>. For help and more information, please read through <a href="https://guides.github.com/features/pages/">the guide </a></p>
<h3>Setting up your domain file</h3>
<p>Create a json file in the <code>sub-logs</code> directory (<code>sub-logs/subdomain.is-a-good.dev</code>).</p>
<p>Please make sure that your json file follows the following format:</p>
<code>
    {
        "repo": "https://github.com/github-username/github-username.github.io",
        "owner": {
            "username": "github-username",
            "email": "your-name-here@domain",
        },
        "target": {
            "CNAME": "github-username.github.io"
        }
    }
</code>
