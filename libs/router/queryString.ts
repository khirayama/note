type IQueryValue = null | string | number | boolean;

export interface IQuery {
  [key: string]: IQueryValue;
}

export const queryString: {
  parse(q: string): IQuery;
  stringify(query: IQuery): string;
} = {
  parse: (q: string): IQuery => {
    const query: IQuery = {};
    let normalizedQueryString: string = q;
    if (q[0] === '?' || q[0] === '#') {
      normalizedQueryString = q.slice(1, q.length);
    }

    const keyValueStrings: string[] = normalizedQueryString.split('&');

    for (const keyValueString of keyValueStrings) {
      const keyValue: string[] = keyValueString.split('=');
      const key: string = keyValue[0];
      let value: string = keyValue[1];
      try {
        value = JSON.parse(value);
      } catch (err) {
        value = value;
      }
      if (key) {
        query[key] = value;
      }
    }

    return query;
  },
  stringify: (query: IQuery): string => {
    let q: string = '';
    const keys: string[] = Object.keys(query);
    for (let i: number = 0; i < keys.length; i += 1) {
      const key: string = keys[i];
      q += `${key}=${query[key]}`;
      if (keys[i + 1]) {
        q += '&';
      }
    }

    return q;
  },
};
