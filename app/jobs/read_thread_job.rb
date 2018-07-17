class ReadThreadJob < Pyr::Async::BaseJob

  def self.mark(message)
    self.push(:message_id => message.id)
  end

  def self.perform(msg)
    puts "ReadThreadJob #{msg.inspect}"

    message_id = msg["message_id"]
    return if message_id.blank?

    message = Message.find_safe(message_id)

    #puts "GOT MESSAGE #{message.inspect}"
    return if message.nil?

    if !message.root_message_id  # special case here
      return if message.read_at

      message.read_at = Time.zone.now
      message.save
      return
    end

    #Message.where(root_message_id: message.root_message_id).where("id <= ?", message.id).where(read_at: nil).update_all(read_at: Time.zone.now)
    #return

    messages = message.thread().where(read_at: nil)
    #puts "GOT #{messages.count} MESSAGES"

    messages.each do |m|
      next if m.read_at 

      m.read_at ||= Time.zone.now
      m.save
    end

  end

end
