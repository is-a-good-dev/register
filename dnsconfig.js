function getDomainsList(filesPath) {
    var result = [];
    var files = glob.apply(null, [filesPath, true, ".json"]);

    for (var i = 0; i < files.length; i++) {
        var name = files[i].split("/").pop().replace(/\.json$/, "");

        result.push({ name: name, data: require(files[i]) });
    }

    return result;
}

var domains = getDomainsList("./domains");
var commit = [];

for (var subdomain in domains) {
    var subdomainName = domains[subdomain].name;
    var domainData = domains[subdomain].data;
    var proxyState = domainData.proxied ? { cloudflare_proxy: "on" } : { cloudflare_proxy: "off" };

    // Handle A records
    if (domainData.target.A) {
        for (var a in domainData.target.A.value) {
            commit.push(A(domainData.target.A.name, IP(domainData.target.A.value[a]), proxyState));
        }
    }

    // Handle AAAA records
    if (domainData.target.AAAA) {
        for (var aaaa in domainData.target.AAAA.value) {
            commit.push(AAAA(domainData.target.AAAA.name, domainData.target.AAAA.value[aaaa], proxyState));
        }
    }

    // Handle CNAME records
    if (domainData.target.CNAME) {
        // Allow CNAME target on root
        if (subdomainName === "@") {
            commit.push(ALIAS(subdomainName, domainData.target.CNAME + ".", proxyState));
        } else {
            commit.push(CNAME(domainData.target.CNAME.name, domainData.target.CNAME.value + ".", proxyState));
        }
    }

    // Handle TXT records
    if (domainData.target.TXT) {
        commit.push(TXT(domainData.target.TXT.name === "@" ? subdomainName : domainData.target.TXT.name + "." + subdomainName, domainData.target.TXT.value));
    }
}

// Commit all DNS records
D("is-a-good.dev", NewRegistrar("none"), DnsProvider(NewDnsProvider("cloudflare")), commit);
