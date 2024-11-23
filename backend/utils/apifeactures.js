class ApiFeactures {
  constructor(query, queryStr) {
    this.query = query;
    this.queryStr = queryStr;
  }

  search() {
    const keyword = this.queryStr.keyword
      ? {
          name: {
            $regex: this.queryStr.keyword,
            $options: "i", // Case-insensitive search
          },
        }
      : {};
    console.log("Search keyword:", keyword); // Debugging log
    this.query = this.query.find({ ...keyword });
    return this;
  }

  filter() {
    const queryCopy = { ...this.queryStr };

    // Remove fields that are not for filtering
    const removeField = ["keyword", "page", "limit"];
    removeField.forEach((key) => delete queryCopy[key]);

    // Convert filter object to a JSON string
    let queryStr = JSON.stringify(queryCopy);

    // Add MongoDB query operators like $gt, $gte, etc.
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, (key) => `$${key}`);

    // Parse the updated query string back into an object
    const parsedQuery = JSON.parse(queryStr);

    // Use the parsed query for filtering
    this.query = this.query.find(parsedQuery);

    console.log("Final Query:", queryStr); // Debugging log
    return this;
  }

  pagination(resultPerpage){
    const currentPage= Number(this.queryStr.page) || 1 ;
    const skip= resultPerpage*(currentPage-1);

    this.query= this.query.limit(resultPerpage).skip(skip);

    return this;
  }
}

module.exports = ApiFeactures;
