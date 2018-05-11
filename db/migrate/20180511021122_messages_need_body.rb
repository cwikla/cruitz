class MessagesNeedBody < ActiveRecord::Migration[5.1]
  def up
    change_column :messages, :body, :text, null: false
  end

  def down
    # nothing to see here
  end
end
