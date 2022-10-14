import lodash from 'lodash'
// 对象数组指定排序的比较函数
// 参数一：数组对象(array数据类型)、参数二：用来判断的对象属性(string数据类型)、参数三：升序还是降序(升序up、降序down、默认升序,string数据类型)
// 如果参数不符合规则返回false 
function compare(newArray,property,valueType){
    return Array.isArray(newArray)&&lodash.cloneDeep(newArray).sort(function(obj1,obj2){//(数据保护+深拷贝)
        var value1 = obj1[property];
        var value2 = obj2[property];
        return valueType=='down'?value2-value1:value1-value2;     // 降序或降序
    })
}
export default {compare}