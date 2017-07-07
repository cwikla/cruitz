class AddUuidToJobs < ActiveRecord::Migration[5.1]
  def up
    add_column :jobs, :uuid, :string, :limit => 36

    Job.reset_column_information

    Job.find_each do |job|
      job.check_uuid
      job.save
    end

    add_index :jobs, [:uuid], :unique => true
  end

  def down
    remove_index :jobs, [:uuid]
    remove_column :jobs, :uuid
  end
end
