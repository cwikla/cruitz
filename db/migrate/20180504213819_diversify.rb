class Diversify < ActiveRecord::Migration[5.1]
  def up
    user_ids = Job.select(:user_id).map(&:user_id).uniq
   
    execute("commit;"); # hack to avoid memory
 
    count  = 0
    Candidate.find_each do |c|
      job = c.job
      cur_user = job.user
      company = cur_user.company
    
      new_user = User.find(user_ids[rand(user_ids.length)])
      job.user = new_user
      job.save
    
      job.uploads.each do |u|
        u.user = new_user
      end
    
      job.messages.each do |m|
        if m.user_id == cur_user.id
          m.user = new_user
        else
          m.from_user = new_user
        end
    
        m.save
      end
    
      count = count + 1
      puts count
    end

    execute("start transaction");
  end

  def down
  end
end
