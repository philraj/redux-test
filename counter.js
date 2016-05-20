import React from 'react';
import ReactDOM from 'react-dom';
import expect from 'expect';
import deepFreeze from 'deep-freeze';

const addCounter = (list) => {
  return [...list, 0];
};

const removeCounter = (list, index) => {
  return [
    ...list.slice(0, index),
    ...list.slice(index + 1)
  ];
};

const incrementCounter = (list, index) => {
  return [
    ...list.slice(0, index),
    list[index] + 1,
    ...list.slice(index + 1)
  ];
};

const testAddCounter = () => {
  const listBefore = [];
  const listAfter = [0];

  deepFreeze(listBefore);

  expect(
    addCounter(listBefore)
  ).toEqual(listAfter);
}

const testRemoveCounter = () => {
  const listBefore = [3, 5, 7, 9];
  const listAfter = [3, 5, 9];

  deepFreeze(listBefore);

  expect(
    removeCounter(listBefore, 2)
  ).toEqual(listAfter);
};

const testIncrementCounter = () => {
  const listBefore = [1, 1, 1, 1];
  const listAfter = [1, 2, 1, 1];

  deepFreeze(listBefore);

  expect(
    incrementCounter(listBefore, 1)
  ).toEqual(listAfter);
}

testAddCounter();
testRemoveCounter();
testIncrementCounter();

console.log('All tests passed. Testing.');
