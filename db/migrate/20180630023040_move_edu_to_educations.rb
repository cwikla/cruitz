class MoveEduToEducations < ActiveRecord::Migration[5.1]
  def up
    Education.reset_column_information

    Experience.where(exp_type: 1).find_each do |exp|
      edu = Education.new

      edu.head_id = exp.head_id
      edu.place = exp.place
      edu.title = exp.title
      edu.year_start = exp.year_start
      edu.year_end = exp.year_end
      edu.description = exp.description
      edu.save!

      puts "Experience migrate to Education: #{edu.id}"
    end

    Experience.where(exp_type: 1).delete_all
  end

  def down
    Education.find_each do |exp|
      edu = Experience.new

      edu.exp_type = 1
      edu.head_id = exp.head_id
      edu.place = exp.place
      edu.title = exp.title
      edu.year_start = exp.year_start
      edu.year_end = exp.year_end
      edu.description = exp.description
      edu.save!

      puts "Education migrated back to Experience: #{edu.id}"
    end

    Education.delete_all
  end
end
