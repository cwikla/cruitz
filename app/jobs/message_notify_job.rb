class MessageNotifyJob < Pyr::Async::BaseJob

  def self.notify(message)
    self.push(message_id: message.id)
  end

  def self.perform(msg)
    return if !::USE_PUSHER

    puts msg.inspect
    message_id = msg["message_id"]
    return if message_id.blank?

    message = Message.find_safe(message_id)
    return if message.nil?

    if message.root_message_id
      root_message = Message.find_safe(message.root_message_id) 
    else
      root_message = message
    end

    user = message.user

    result = MessageSerializer.new(message, current_user: user).as_json
    root_result = MessageSerializer.new(root_message, current_user: user).as_json

    stats = user.pusher_private_batch([
      { name: "messages-add", data: { message: root_result} },
      { name: "message-#{root_message.id}-thread", data: { message: result } } # yes root_message.id
    ])
    #puts "PUSHER: #{stats}"
  end

end
