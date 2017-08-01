class SetDefaultBodyToNull < ActiveRecord::Migration[5.1]
  def up
    Message.where(:body => :nil).update_all(:body => "Lorem Ipsum")
  end

  def down
  end
end
