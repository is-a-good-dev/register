function getDomainsList(filesPath) {
    var result = [];
    var files = glob.apply(null, [filesPath, true, ".json"]);

    for (var i = 0; i < files.length; i++) {
        var name = files[i].split("/").pop().replace(/\.json$/, "");

        result.push({ name: name, data: require(files[i]) });
    }

    return result;
}

var allDomains = getDomainsList("./domains");

var commit = [];

for (var subdomain in allDomains) {
    var subdomainName = allDomains[subdomain].name;
    var domainData = allDomains[subdomain].data;
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
            commit.push(ALIAS(domainData.target.CNAME.name, domainData.target.CNAME.value + ".", proxyState));
        } else {
            commit.push(CNAME(domainData.target.CNAME.name, domainData.target.CNAME.value + ".", proxyState));
        }
    }

    // Handle TXT records
    if (domainData.target.TXT) {
        if (Array.isArray(domainData.target.TXT)) {
            for (var txt in domainData.target.TXT) {
                var txtRecord = domainData.target.TXT[txt];
                commit.push(TXT(txtRecord.name, txtRecord.value));
            }
        } else {
            commit.push(TXT(domainData.target.TXT.name === "@" ? subdomainName : domainData.target.TXT.name + "." + subdomainName, domainData.target.TXT.value));
        }
    }
}

// *._domainkey.is-a-good.dev
commit.push(IGNORE("*._domainkey", "TXT"));
// _acme-challenge.is-a-good.dev
commit.push(IGNORE("_acme-challenge", "TXT"));
// _autodiscover._tcp.is-a-good.dev
commit.push(IGNORE("_autodiscover._tcp", "SRV"));
// _dmarc.is-a-good.dev
commit.push(IGNORE("_dmarc", "TXT"));
// _psl.is-a-good.dev
commit.push(IGNORE("_psl", "TXT"));
// autoconfig.is-a-good.dev
commit.push(IGNORE("autoconfig", "CNAME"));
// autodiscover.is-a-good.dev
commit.push(IGNORE("autodiscover", "CNAME"));
// *.mx.is-a-good.dev
commit.push(IGNORE("*", "MX", "*"));

// Commit all DNS records
D("is-a-good.dev", NewRegistrar("none"), DnsProvider(NewDnsProvider("cloudflare")), commit);