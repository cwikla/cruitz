class AddUuidToMessages < ActiveRecord::Migration[5.1]
  def up
    add_column :messages, :uuid, :string, :limit => 36

    Message.reset_column_information

    Message.find_each do |message|
      message.check_uuid
      message.save
    end

    add_index :messages, [:uuid], :unique => true
  end

  def down
    remove_index :messages, [:uuid]
    remove_column :messages, :uuid
  end
end
