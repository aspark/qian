module.exports={
        
    minusDic: function (dicA, dicB){
        var results =[];
        Object.keys(dicA).forEach(function(key) {
            if(!dicB[key]){
                results.push(dicA[key])
            }
        }, this);

        return results;
    },

    convert2Dic: function (items, getKey){
        var dic = {}
        if(items!=null){
            items.forEach(function(element) {
                dic[getKey(element)] = element;
            });
        }

        return dic;
    }


}