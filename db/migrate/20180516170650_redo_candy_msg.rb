class RedoCandyMsg < ActiveRecord::Migration[5.1]
  def default_msg(candidate)
    head = candidate.head.recruiter
    body = "New candidate #{head.full_name}"
    Message.create!(candidate: candidate, user: candidate.hirer, from_user: recruiter, job: job, body: body)
  end

  def up
    Candidate.reset_column_information

    Candidate.find_each do |c|
      puts "Candidate: #{c.id}"
      msg = c.description || default_msg(c)
      puts "#{msg.root_message.inspect} => #{msg.inspect}"
      c.description = (msg.root_message || msg)
      c.save!
    end
  end

  def down
    # nothing to see here
  end
end
