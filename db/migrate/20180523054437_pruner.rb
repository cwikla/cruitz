class Pruner < ActiveRecord::Migration[5.1]
  def up
    u = User.where(email: "demo@cruitz.com").first

    puts "MSG COUNT: #{u.messages.count}"
    
    puts "CAND COUNT: #{u.candidates.count}"


    i = 0
    u.candidates.each do |c|
      i = i + 1
      next if c.state > 0
      next if c.messages.count > 1
      next if ((i % 2) == 0)
    
      puts "#{c.id} => #{c.messages.count}"
    
      Candidate.transaction do
        c.messages.destroy_all
        c.destroy
      end
    end
  end

  def down
    # nothing to see here
  end
end
