import { SeparateWordsPipe } from './separate-words.pipe';

fdescribe('SeparateWordsPipe', () => {
  it('create an instance', () => {
    const pipe = new SeparateWordsPipe();
    expect(pipe).toBeTruthy();
  });

  it('separate words written in camelCase', () => {
    const pipe = new SeparateWordsPipe();
    expect(pipe.transform('camelCase')).toEqual('camel case');
    expect(pipe.transform('evenMoreWordsInCamelCase')).toEqual('even more words in camel case');
    expect(pipe.transform('аТеперьНемногоРусскихТестов')).toEqual('а теперь немного русских тестов');
  });

  it('separate words written in UpperСamelCase', () => {
    const pipe = new SeparateWordsPipe();
    expect(pipe.transform('CamelCase')).toEqual('camel case');
    expect(pipe.transform('EvenMoreWordsInCamelCase')).toEqual('even more words in camel case');
    expect(pipe.transform('АТеперьНемногоРусскихТестов')).toEqual('а теперь немного русских тестов');
  });
});
