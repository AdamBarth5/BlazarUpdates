function jsonReader(fileName) {
    let r = fs.readFileSync("./"+fileName);
    return JSON.parse(r);
}


$("#exportAccounts").click(() => {
    var accs = jsonReader("accounts.json")
    for (var service of Object.keys(accs)){
        fs.writeFileSync("./"+service+".json", JSON.stringify(accs[service]))
    }
    toast.showSuccess("All the accounts have been exported")
})

$("#wipeAccounts").click(() => {
    var file = jsonReader("accounts.json");
    for (var service of Object.keys(file)){
        file[service] = []
    }
    fs.writeFileSync("accounts.json", JSON.stringify(file))

    //$("#bestBuyAccounts tbody").find("tr").each((index, elem) => {if (index !== 0) {$(elem).remove()}})
    for(var service of Object.keys(accountServices)){
        $("#"+accountServices[service]+" tbody").find("tr").each((index, elem) => {if (index !== 0) {$(elem).remove()}})
    }
    toast.showError("All the accounts have been wiped")
})