class ReadThreadJob < Pyr::Async::BaseJob

  def self.mark(thread)
    self.push(:message_id => thread.last.id)
  end

  def self.perform(msg)
    puts msg.inspect
    message_id = msg["message_id"]
    return if message_id.blank?

    message = Message.find_safe(message_id)
    puts "GOT MESSAGE #{message.inspect}"
    return if message.nil?

    messages = message.thread()
    puts "GOT #{messages.count} MESSAGES"
    messages.each do |m|
      m.read_at = Time.zone.now
      m.save
    end
  end

end
