export class Helper {
  public static async getNextIterator(iterator) {
    const resIter = await iterator.next();
    // resIter.value = resIter.value
    //   ? JSON.parse resIter.value.value.toString('utf8'))
    //   : null;
    if (resIter.value) {
      let json = JSON.parse(resIter.value.value.toString('utf8'))
      json["key"] = resIter.value.key;
      resIter.value = json
    }
    return resIter;
  }

  public static async convertIteratorToArray(iterator) {
    const arr = [];
    let resIter = await this.getNextIterator(iterator);

    if (!resIter.value) {
      return arr;
    }

    arr.push(resIter.value);
    while (!resIter.done) {
      resIter = await this.getNextIterator(iterator);
      console.log("resIter.value", resIter.value, resIter.value !== null, resIter.value != null, resIter.value == undefined);

      if (resIter.value !== null) {
        arr.push(resIter.value);
      }

    }
    return arr;
  }

}

