class CleanUpLockedMessages < ActiveRecord::Migration[5.1]
  def up
    Candidate.where(unlocked_at: nil).find_each do |c|
      msg = c.description
      msg.thread.each do |t|
        puts "#{t.id}"
        next if !t.root_message_id # this is the root
        t.destroy
      end
    end
  end

  def down
    # nothing to see
  end
end
