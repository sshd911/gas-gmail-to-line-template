const sendLine = (body) => {
  let options = {
    "method": "post",
    "payload": {
      'message': body
    },
    "headers": { "Authorization": "Bearer " + "u3NB4PxYeGkJNsONAi2UIKYKHquQPy2gYRK8Xoa8cPd" }
  };
  UrlFetchApp.fetch("https://notify-api.line.me/api/notify", options);
}

const setSearchCondition = () => {
  const now = Math.floor(new Date().getTime() / 1000);
  const interval = 20;
  const term = now - (60 * interval);

  return '(is:unread after:' + term + ')';
}

const searchMail = (searchCondition) => {
  return GmailApp.search(searchCondition);
}

const getMessages = (searchResult) => {
  const mails = GmailApp.getMessagesForThreads(searchResult);

  let detailMessages = []
  for (const messages of mails) {
    const message = messages.pop()
    try {
       // if you want to filtering you can use this. 
      if (message.getFrom() !== "target@gmail.com") { throw new Error('This mail is not target.') }
      detailMessages.push(
        "\n【日時】: " + Utilities.formatDate(message.getDate(), 'JST', 'm月d日 HH時mm分')
        + "\n【送信者】: " + message.getFrom()
        + "\n【タイトル】: " + message.getSubject()
        + "\n【内容】: \n" + message.getPlainBody().slice(0, 200)
      )
    } catch (e) {
      return new Error('message: ' + e)
    }
  }

  GmailApp.markThreadsRead(searchResult);
  return detailMessages;
}

const main = () => {
  const result = searchMail(setSearchCondition())
  if (result.length > 0) {
    const messages = getMessages(result)

    messages.forEach(message => {
      sendLine(message)
    })
  }
}
