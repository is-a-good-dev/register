function getDomainsList(filesPath) {
    var result = [];
    var files = glob.apply(null, [filesPath, true, ".json"]);

    for (var i = 0; i < files.length; i++) {
        var name = files[i].split("/").pop().replace(/\.json$/, "");

        result.push({ name: name, data: require(files[i]) });
    }

    return result;
}

var domains = getDomainsList("./sub-logs");
var commit = [];

for (var subdomain in domains) {
    var subdomainName = domains[subdomain].name;
    var domainData = domains[subdomain].data;
    var proxyState = domainData.proxied ? { cloudflare_proxy: "on" } : { cloudflare_proxy: "off" };

    // Handle A records
    if (domainData.record.A) {
        for (var a in domainData.record.A.value) {
            commit.push(A(domainData.record.A.name, IP(domainData.record.A.value[a]), proxyState));
        }
    }

    // Handle AAAA records
    if (domainData.record.AAAA) {
        for (var aaaa in domainData.record.AAAA.value) {
            commit.push(AAAA(domainData.record.AAAA.name, domainData.record.AAAA.value[aaaa], proxyState));
        }
    }

    // Handle CNAME records
    if (domainData.record.CNAME) {
        // Allow CNAME record on root
        if (subdomainName === "@") {
            commit.push(ALIAS(subdomainName, domainData.record.CNAME + ".", proxyState));
        } else {
            commit.push(CNAME(domainData.record.CNAME.name, domainData.record.CNAME.value + ".", proxyState));
        }
    }

    // Handle TXT records
    if (domainData.record.TXT) {
        commit.push(TXT(domainData.record.TXT.name === "@" ? subdomainName : domainData.record.TXT.name + "." + subdomainName, domainData.record.TXT.value));
    }
}

// Commit all DNS records
D("is-a-good.dev", NewRegistrar("none"), DnsProvider(NewDnsProvider("cloudflare")), commit);
