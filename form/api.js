export async function fakeRequest(payload) {
  return new Promise(resolve => {
    setTimeout(resolve, 1000);
    console.log(payload);
  });
}