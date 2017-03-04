/**
 * File: main.js
 * Description: Used for default or global scripts.
 *
 * @author Arnold Koh <arnold@kohded.com>
 * @version 2.0, developed 9/23/16
 */

const main = {
  div: {
    loginModalBtn: $('#login-modal-btn')
  }
};

$(() => {
  main.div.loginModalBtn.leanModal();
});
